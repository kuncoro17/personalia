import { QueryTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const CHILD_TABLE = 'prs_unit_kerja';
const PARENT_TABLE = 'prs_bagian';
const CONSTRAINT_NAME = 'prs_unit_kerja_kode_bagian_foreign';

type ConstraintRow = {
  update_action: string;
};

const findConstraint = async (
  sequelize: Parameters<Migration['up']>[0]['sequelize'],
  transaction: Parameters<Migration['up']>[0]['transaction']
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
        constraintName: CONSTRAINT_NAME,
      },
    }
  );

  return rows[0] ?? null;
};

const replaceConstraint = async (
  sequelize: Parameters<Migration['up']>[0]['sequelize'],
  transaction: Parameters<Migration['up']>[0]['transaction'],
  updateAction: 'CASCADE' | 'NO ACTION'
) => {
  await sequelize.query(
    `
      ALTER TABLE "public"."${CHILD_TABLE}"
        DROP CONSTRAINT "${CONSTRAINT_NAME}",
        ADD CONSTRAINT "${CONSTRAINT_NAME}"
          FOREIGN KEY ("kode_bagian")
          REFERENCES "public"."${PARENT_TABLE}" ("kode")
          ON UPDATE ${updateAction}
          ON DELETE NO ACTION
    `,
    { transaction }
  );
};

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
    const [childExists, parentExists] = await Promise.all([
      queryInterface.tableExists(CHILD_TABLE, { transaction }),
      queryInterface.tableExists(PARENT_TABLE, { transaction }),
    ]);
    if (!childExists || !parentExists) return;

    const constraint = await findConstraint(sequelize, transaction);
    if (!constraint || constraint.update_action === 'CASCADE') return;

    await replaceConstraint(sequelize, transaction, 'CASCADE');
  },

  async down({ queryInterface, sequelize, transaction }) {
    const [childExists, parentExists] = await Promise.all([
      queryInterface.tableExists(CHILD_TABLE, { transaction }),
      queryInterface.tableExists(PARENT_TABLE, { transaction }),
    ]);
    if (!childExists || !parentExists) return;

    const constraint = await findConstraint(sequelize, transaction);
    if (!constraint || constraint.update_action === 'NO ACTION') return;

    await replaceConstraint(sequelize, transaction, 'NO ACTION');
  },
};

export default migration;
