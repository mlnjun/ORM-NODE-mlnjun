// 채팅 채널 정보 Model

module.exports = function(sequelize, DataTypes){
  const Channel = sequelize.define(
    'channel',
    {
      channel_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: "채널고유번호"
      },
      community_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        comment: "커뮤니티고유번호"
      },
      category_code:{
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "채널분류코드"
      },
      channel_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "채널명"
      },
      user_limit:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "동시채널접속자수"
      },
      channel_img_path:{
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "대표이미지주소"
      },
      channel_desc:{
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: "채널간략소개"
      },
      channel_state_code:{
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "채널오픈상태코드"
      },
      reg_date:{
        type: DataTypes.DATE,
        allowNull: false,
        comment: "등록일시"
      },
      reg_member_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "등록자고유번호"
      },
      edit_date:{
        type: DataTypes.DATE,
        allowNull: true,
        comment: "수정일시"
      },
      edit_member_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "수정자고유번호"
      }
    },

    {
      sequelize,
      tableName:"channel",
      timestamps: false,
      comment: "채팅 채널 테이블",
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'channel_id' }]
        }
      ]
    }
    )
    return Channel;
  };