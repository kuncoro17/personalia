// // models/SDMCheckinout.ts
// import { DataTypes, Model } from 'sequelize';
// import { sequelize } from '../config/database';

// export class SDMCheckinout extends Model {
//   public id!: number;
//   public userid!: string;
//   public checktime!: Date;
//   public checktype!: string | null;
//   public verifycode!: number | null;
//   public sensorid!: string | null;
//   public memoinfo!: string | null;
//   public workcode!: number | null;
//   public sn!: string | null;
//   public userextfmt!: number | null;
//   public employeename!: string | null;
//   public nik!: string | null;
//   public deptname!: string | null;
//   public usergroup!: string | null;
//   public machine!: string | null;
//   public created!: Date | null;
//   public createdby!: string | null;
//   public modified!: Date | null;
//   public modifiedby!: string | null;
//   public keterangan!: string | null;
//   public attachment!: string | null;
//   public tgl_insert!: Date | null;
// }

// SDMCheckinout.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     userid: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//     },
//     checktime: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     checktype: {
//       type: DataTypes.STRING(1),
//       allowNull: true,
//     },
//     verifycode: {
//       type: DataTypes.INTEGER,
//       defaultValue: 1,
//     },
//     sensorid: {
//       type: DataTypes.STRING(5),
//       allowNull: true,
//     },
//     memoinfo: {
//       type: DataTypes.STRING(30),
//       allowNull: true,
//     },
//     workcode: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     sn: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },
//     userextfmt: {
//       type: DataTypes.SMALLINT,
//       allowNull: true,
//     },
//     employeename: {
//       type: DataTypes.STRING(40),
//       allowNull: true,
//     },
//     nik: {
//       type: DataTypes.STRING(191),
//       allowNull: true,
//     },
//     deptname: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     usergroup: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//     },
//     machine: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     created: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     createdby: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//     },
//     modified: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     modifiedby: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//     },
//     keterangan: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     attachment: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     tgl_insert: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'sdm_checkinout',
//     timestamps: false,
//   }
// );

// export default SDMCheckinout;
