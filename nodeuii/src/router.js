import Router from 'koa-router';
import request from 'superagent';
import cheerio from 'cheerio';
import * as util from './util';
import myMongoose from './mongoose.js';

const router = new Router();

router.get('/startspider', async (ctx) => {
	var i = 1;
	var allArray = [];
	while (i < 25) {
		var page = await new Promise((resolve) => {
			request
				.post('http://171.221.172.13:8888/lottery/accept/projectList?pageNo=' + i)
				.end((err, result) => {
					var $ = cheerio.load(result.res.text);
					var trList = [];
					$('#_projectInfo>tr').each((i, tr) => {
						var tdList = [];
						$(tr).find('td').each((j, td) => {
							tdList.push($(td).text());
						});
						trList.push(tdList);
					});
					resolve(util.transformArray(trList));
				});
		});
		allArray = allArray.concat(page);
		++i;
	}
	allArray.forEach(item => {
		myMongoose.add(item);
	});
	ctx.body = allArray;
}).get('/getMongoData', async (ctx) => {
	var result = await myMongoose.find();
	ctx.body = result;
}).get('/initspider', async (ctx) => {
	var i = 1;
	var allArray = [];
	while (i < 25) {
		var page = await new Promise((resolve) => {
			request
				.post('http://171.221.172.13:8888/lottery/accept/projectList?pageNo=' + i)
				.end((err, result) => {
					var $ = cheerio.load(result.res.text);
					var trList = [];
					$('#_projectInfo>tr').each((i, tr) => {
						var tdList = [];
						$(tr).find('td').each((j, td) => {
							tdList.push($(td).text());
						});
						trList.push(tdList);
					});
					resolve(util.transformArray(trList));
				});
		});
		allArray = allArray.concat(page);
		++i;
	}
	myMongoose.addMany(allArray);
	ctx.body = allArray;
}).get('/spiderPageOne', async (ctx) => {
	var page = await new Promise((resolve) => {
		request
			.post('http://171.221.172.13:8888/lottery/accept/projectList')
			.end((err, result) => {
				var $ = cheerio.load(result.res.text);
				var trList = [];
				$('#_projectInfo>tr').each((i, tr) => {
					var tdList = [];
					$(tr).find('td').each((j, td) => {
						tdList.push($(td).text());
					});
					trList.push(tdList);
				});
				resolve(util.transformArray(trList));
			});
	});
	// 生成一个Promise对象的数组
	const promises = page.map(function (item) {
		return new Promise(resolve=>{
			resolve(myMongoose.add(item));
		});
	});
	var successArray=await Promise.all(promises).then(function (posts) {
		return posts.filter(item=>!!item);
	}).catch(function(){
		return [];
	});
	ctx.body = {
		successArray,
		allLength:page.length
	};
});

export default {
	init(app) {
		app.use(router.routes()).use(router.allowedMethods());
	}
};
