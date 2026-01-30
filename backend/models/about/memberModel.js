const {DataTypes} =require('sequelize');
const sequelize =require('../../config/db');

const Member =sequelize.define('Member',{
    name:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    role:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    bio:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    photo_url:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    type:{
        type:DataTypes.ENUM('board','staff'),
        allowNull:false
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
});

module.exports = Member;