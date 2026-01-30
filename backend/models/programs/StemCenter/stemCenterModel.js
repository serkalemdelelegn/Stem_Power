const {DataTypes}=require('sequelize');
const sequelize = require('../../../config/db');
const stemOperation =require('./stemOperationModel');
const StemOperation = require('./stemOperationModel');

const StemCenter =sequelize.define('StemCenter',{
    operationId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:stemOperation,
            key:'id'
        },
        onDelete:'CASCADE'
    },
    name:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    host:{
        type:DataTypes.STRING(150),
        allowNull:true
    },
    photos:{
        type:DataTypes.JSON,
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
    country:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    cluster:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    contact:{
        type:DataTypes.STRING(150),
        allowNull:true
    },
    phone:{
        type:DataTypes.STRING(50),
        allowNull:true
    },
    email:{
        type:DataTypes.STRING(150),
        allowNull:true
    },
    labs:{
        type:DataTypes.STRING(250),
        allowNull:true
    },
    founder:{
         type:DataTypes.STRING(150),
         allowNull:true
    },
    year_established:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min:1900,
            max:new Date().getFullYear()
        }
    },
    latitude:{
        type:DataTypes.DECIMAL(10,8),
        allowNull:true
    },
    longtiude:{
        type:DataTypes.DECIMAL(11,8),
        allowNull:true
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    }

},{
    tableName:'stem_centers',
    timestamps:true
});

StemOperation.hasMany(StemCenter,{foreignKey:'operationId',as:'centers'});
StemCenter.belongsTo(StemOperation,{foreignKey:'operationId',as:'operation'});

module.exports =StemCenter;