import { QueryTypes } from 'sequelize';

import type { Migration } from '../types/migration';

type RelationConfig = {
  constraintName: string;
  childColumn: string;
  parentTable: string;
};

const CHILD_TABLE = 'prs_unit_kerja';
const RELATIONS: RelationConfig[] = [
  {
    constraintName: 'prs_unit_kerja_kode_divisi_foreign',
    childColumn: 'kode_divisi',
    parentTable: 'prs_divisi',
  },
  {
    constraintName: 'prs_unit_kerja_kode_seksi_foreign',
    childColumn: 'kode_seksi',
    parentTable: 'prs_seksi',
  },
];

type ConstraintRow = {
  update_action: string;
};

const findConstraint = async (
  sequelize: Parameters<Migration['up']>[0]['sequelize'],
  transaction: Parameters<Migration['up']>[0]['transaction'],
  constraintName: string
) => {
  const rows = await sequelize.query<ConstraintRow>(
    `
      SELECT rc.update_rule AS update_action
      FROM information_schema.referential_constraints rc
      JOIN information_schema.table_constraints tc
        ON tc.constraint_catalog = rc.constraint_catalog
       AND tc.constraint_schema = rc.constraint_schema
       AND tc.constraint_name = rc.constraint_name
      WHERE tc.table_schema = 'public'
        AND tc.table_name = :childTable
        AND tc.constraint_name = :constraintName
    `,
    {
      type: QueryTypes.SELECT,
      transaction,
      replacements: {
        childTable: CHILD_TABLE,
        constraintName,
      },
    }
  );

  return rows[0] ?? null;
};

const replaceConstraint = async (
  sequelize: Parameters<Migration['up']>[0]['sequelize'],
  transaction: Parameters<Migration['up']>[0]['transaction'],
  relation: RelationConfig,
  updateAction: 'CASCADE' | 'NO ACTION'
) => {
  await sequelize.query(
    `
      ALTER TABLE "public"."${CHILD_TABLE}"
        DROP CONSTRAINT "${relation.constraintName}",
        ADD CONSTRAINT "${relation.constraintName}"
          FOREIGN KEY ("${relation.childColumn}")
          REFERENCES "public"."${relation.parentTable}" ("kode")
          ON UPDATE ${updateAction}
          ON DELETE NO ACTION
    `,
    { transaction }
  );
};

const applyUpdateAction = async (
  context: Parameters<Migration['up']>[0],
  updateAction: 'CASCADE' | 'NO ACTION'
) => {
  const childExists = await context.queryInterface.tableExists(CHILD_TABLE, {
    transaction: context.transaction,
  });
  if (!childExists) return;

  for (const relation of RELATIONS) {
    const parentExists = await context.queryInterface.tableExists(
      relation.parentTable,
      { transaction: context.transaction }
    );
    if (!parentExists) continue;

    const constraint = await findConstraint(
      context.sequelize,
      context.transaction,
      relation.constraintName
    );
    if (!constraint || constraint.update_action === updateAction) continue;

    await replaceConstraint(
      context.sequelize,
      context.transaction,
      relation,
      updateAction
    );
  }
};

const migration: Migration = {
  async up(context) {
    await applyUpdateAction(context, 'CASCADE');
  },

  async down(context) {
    await applyUpdateAction(context, 'NO ACTION');
  },
};

export default migration;
