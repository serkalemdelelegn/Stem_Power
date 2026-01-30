const {DataTypes}=require('sequelize');
const sequelize = require('../../../config/db');

const StemOperation = sequelize.define('StemOperation',{
    title:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    media_url:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
},{
    tableName:'stem_operations',
    timestamps:true
});

module.exports = StemOperation;