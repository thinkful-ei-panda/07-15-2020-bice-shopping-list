const ItemService={
    getAllItems(knex){
        return knex.select('*').from('shoppinglist');
    },
    insertItem(knex,newItem){
        return knex
        .insert(newItem)
        .into('shoppinglist')
        .returning('*')
        .then(rows=>{
            return rows[0];
        });
    },
    getById(knex,id){
        return knex.from('shoppinglist').select('*').where('id',id).first();
    },
    deleteItem(knex,id){
        return knex('shoppinglist')
        .where({id})
        .delete();
    },
    updateItem(knex,id,newItemFields){
        return knex('shoppinglist')
        .where({ id })
        .update(newItemFields);
    },
};

module.exports=ItemService;