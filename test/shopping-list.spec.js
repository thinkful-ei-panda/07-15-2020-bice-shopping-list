const ItemService = require('../src/shopping-list')
const knex = require('knex')

describe(`Items service object`, function() {
	let db
	let testItems = [
			{
			  id: 1,
			  checked:false,
			  name: 'First test item!',
			  date_added: new Date('2029-01-22T16:28:32.615Z'),
			  price: '12.00',
			  category: 'Main'
			},
			{
			  id: 2,
			  checked:false,
			  name: 'Second test item!',
			  date_added: new Date('2100-05-22T16:28:32.615Z'),
			  price: '21.00',
			  category: 'Snack'
			},
			{
			  id: 3,
			  checked:false,
			  name: 'Third test item!',
			  date_added: new Date('1919-12-22T16:28:32.615Z'),
			  price: '3.00',
			  category: 'Lunch'
			},
			{
			  id: 4,
			  checked:false,
			  name: 'Third test item!',
			  date_added: new Date('1919-12-22T16:28:32.615Z'),
			  price: '0.99',
			  category: 'Breakfast'
			},
	];
	
	before(() => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		})
	})
	
	before(() => db('shoppinglist').truncate())

	afterEach(() => db('shoppinglist').truncate())

	after(() => db.destroy())

	context(`Given 'shoppinglist' has data`, () => {
		beforeEach(() => {
			return db
			.into('shoppinglist')
			.insert(testItems)
		})
		
		it(`getAllItems() resolves all items from 'shoppinglist' table`, () => {
			return ItemService.getAllItems(db)
				.then(actual => {
					expect(actual).to.eql(testItems.map(item => ({
						...item,
						date_added: new Date(item.date_added)
					})))
				})
		})

		it(`getById() resolves an article by id from 'shoppinglist' table`, () => {
			const thirdId = 3
			const thirdTestItem = testItems[thirdId - 1]
			return ItemService.getById(db, thirdId)
			.then(actual => {
				expect(actual).to.eql({
					id:thirdId,
					category: thirdTestItem.category,
					checked:thirdTestItem.checked,
         			name: thirdTestItem.name,
         			price: thirdTestItem.price,
					date_added: new Date(thirdTestItem.date_added),
				})
			})
		})

		it(`deleteItem() removes an article by id from 'shoppinglist' table`, () => {
			const itemId = 3
			return ItemService.deleteItem(db, itemId)
			.then(() => ItemService.getAllItems(db))
			.then(allItems => {
				// copy the test articles array without the "deleted" article
				const expected = testItems.filter(item => item.id !== itemId)
				expect(allItems).to.eql(expected)
			})
		})

		it(`updateItem() updates an article from the 'shoppinglist' table`, () => {
			const idOfItemToUpdate = 3
			const newItemData = {
				id: idOfItemToUpdate,
				category: 'Main',
				checked:false,
         		name: 'name',
         		price: '9.99',
				date_added: new Date(),
			}
			return ItemService.updateItem(db, idOfItemToUpdate, newItemData)
			.then(() => ItemService.getById(db, idOfItemToUpdate))
			.then(item => {
				expect(item).to.eql({
					id: idOfItemToUpdate,
					...newItemData,
				})
			})
		})
	})

	context(`Given 'shoppinglist' has no data`, () => {
		it(`getAllItems() resolves an empty array`, () => {
			return ItemService.getAllItems(db)
			.then(actual => {
				expect(actual).to.eql([])
			})
		})
		
		it(`insertItem() inserts a new Item and resolves the new Item with an 'id'`, () => {
			const newItem = {
				category: 'Main',
				checked:false,
				name: 'Test new title',
				price: '9.99',
				date_added: new Date('2020-01-01T00:00:00.000Z'),
			}
			return ItemService.insertItem(db, newItem)
			.then(actual => {
				expect(actual).to.eql({
					id: 1,
					category: newItem.category,
					checked:newItem.checked,
         			name: newItem.name,
         			price: newItem.price,
					date_added: new Date(newItem.date_added),
				})
			})
		})
	})

})