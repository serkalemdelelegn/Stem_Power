const {DataTypes} =require('sequelize');
const sequelize = require("../../config/db");


const ContactOffice=sequelize.define('ContactOffice',{
    country_office:{
        type:DataTypes.STRING(250),
        allowNull:false
    },
    office_name:{
        type:DataTypes.STRING(150),
        allowNull:true,
    },
    address:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    city:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    region:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    postal_code:{
        type:DataTypes.STRING(50),
        allowNull:true
    },
    email:{
        type:DataTypes.STRING(150),
        allowNull:true,
        validate:{isEmail:true}
    },
    phone:{
        type:DataTypes.STRING(50),
        allowNull:true
    },
    latitude:{
        type:DataTypes.DECIMAL(10,8),
        allowNull:true 

    },
    longtiude:{
        type:DataTypes.DECIMAL(11,8),
        allowNull:true 
    },
    map_link:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    website:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    office_hours:{
        type:DataTypes.STRING(200),
        allowNull:true
    },
    mobile:{
        type:DataTypes.STRING(50),
        allowNull:true
    },
    image:{
        type:DataTypes.TEXT,
        allowNull:true
    }
},{
    tableName:'contact_offices',
    timestamps:true
});


module.exports= ContactOffice;