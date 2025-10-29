// models/komik.js
module.exports = (sequelize, DataTypes) => {
  const Komik = sequelize.define(
    "Komik",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      judul: {
        type: DataTypes.STRING(100),   // varchar(100)
        allowNull: false
      },
      penulis: {
        type: DataTypes.STRING(100),   // varchar(100)
        allowNull: false
      },
      deskripsi: {
        type: DataTypes.INTEGER,          // text
        allowNull: false
      },
      tahun_terbit: {
        type: DataTypes.INTEGER,       // int
        allowNull: false
      },
      penerbit: {
        type: DataTypes.STRING(100),   // varchar(100)
        allowNull: true                // kolom boleh null
      }
      // createdAt & updatedAt dikelola otomatis oleh Sequelize (timestamps: true)
    },
    {
      tableName: "komik",
      freezeTableName: true,
      timestamps: true                 // pakai kolom createdAt & updatedAt
    }
  );

  return Komik;
};
