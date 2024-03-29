// 채팅 채널 정보 Model

module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    'article_file',
    {
      article_file_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
        allowNull: false,
        comment: "첨부파일고유번호"
      },
      article_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "채널고유번호"
      },
      file_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "파일명"
      },
      file_size:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "파일사이즈"
      },
      file_path:{
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "저장경로"
      },
      file_type:{
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "파일유형"
      },
      reg_date:{
        type: DataTypes.DATE,
        allowNull: false,
        comment: "업로드일시"
      },
      reg_member_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "등록자고유번호"
      }
    },

    {
      sequelize,
      tableName:"article_file",
      timestamps: false,
      comment: "게시판 첨부 파일 테이블",
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name:'article_file_id' }]
        }
      ]
    }
)};