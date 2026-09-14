import { describe, expect, it, jest } from '@jest/globals';
import { QueryTypes } from 'sequelize';
import migration from '../../../src/migrations/20260911000003-create-attendance-routines';
import { attendanceRoutines } from '../../../src/migrations/sql/attendance-routines';
import type { MigrationContext } from '../../../src/types/migration';

jest.mock('../../../src/utils/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const setup = () => {
  // eslint-disable-next-line no-unused-vars
  const query = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  const transaction = {};
  const context = {
    sequelize: { query },
    transaction,
  } as unknown as MigrationContext;
  return { query, context, transaction };
};

describe('attendance routine baseline', () => {
  it('creates every routine in an empty database within the migration transaction', async () => {
    const { query, context, transaction } = setup();
    for (let index = 0; index < attendanceRoutines.length; index++) {
      query.mockResolvedValueOnce([{ exists: false }]);
      query.mockResolvedValueOnce([]);
    }

    await migration.up(context);

    expect(query).toHaveBeenCalledTimes(attendanceRoutines.length * 2);
    attendanceRoutines.forEach((routine, index) => {
      expect(query).toHaveBeenNthCalledWith(
        index * 2 + 1,
        'SELECT to_regprocedure(:signature) IS NOT NULL AS "exists"',
        {
          replacements: { signature: routine.signature },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
      expect(query).toHaveBeenNthCalledWith(index * 2 + 2, routine.sql, {
        transaction,
      });
    });
  });

  it('never replaces or drops existing routines, even with different return types', async () => {
    const { query, context } = setup();
    query.mockResolvedValue([{ exists: true }]);

    await migration.up(context);

    expect(query).toHaveBeenCalledTimes(attendanceRoutines.length);
    for (const [sql] of query.mock.calls) {
      expect(sql).toBe(
        'SELECT to_regprocedure(:signature) IS NOT NULL AS "exists"'
      );
    }
  });

  it('creates the missing varchar overload while preserving the text overload', async () => {
    const { query, context, transaction } = setup();
    const missing = attendanceRoutines.find(routine =>
      routine.signature.includes('character varying')
    )!;
    query.mockImplementation(async (sql, options) => {
      if (sql === missing.sql) return [];
      const { replacements } = options as {
        replacements: { signature: string };
      };
      return [{ exists: replacements.signature !== missing.signature }];
    });

    await migration.up(context);

    expect(query).toHaveBeenCalledTimes(attendanceRoutines.length + 1);
    expect(query).toHaveBeenCalledWith(missing.sql, { transaction });
  });

  it('propagates database failures so the runner rolls back the migration', async () => {
    const { query, context } = setup();
    query.mockResolvedValueOnce([{ exists: false }]);
    query.mockRejectedValueOnce(new Error('permission denied'));

    await expect(migration.up(context)).rejects.toThrow('permission denied');
    expect(query).toHaveBeenCalledTimes(2);
  });
});
