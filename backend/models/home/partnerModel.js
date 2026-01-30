const {DataTypes} =require('sequelize');
const sequelize =require('../../config/db');


const Partner =sequelize.define('Partner',{
    name:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    logo_url:{
        type:DataTypes.STRING(500),
        allowNull:false
    },
    website_url:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
},{
    tableName:'featured_partners',
    timestamps:true
});

module.exports =Partner;