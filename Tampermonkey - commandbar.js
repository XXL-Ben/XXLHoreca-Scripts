// ==UserScript==
// @name         XXLHoreca Command Bar
// @namespace    XXLHoreca
// @version      1.4.1
// @description  Command bar for MyOdoo
// @author       Ben Leonard & Wessel Verheij <info@nightworks.io>
// @downloadURL  https://raw.githubusercontent.com/XXL-Ben/XXLHoreca-Scripts/main/commandbar.js
// @updateURL    https://raw.githubusercontent.com/XXL-Ben/XXLHoreca-Scripts/main/commandbar.js
// @match        https://xxlhoreca.myodoo.nl/web*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myodoo.nl
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
	'use strict';

	setTimeout(function() {
		document.onkeypress = function(e) {
			if (e.keyCode == 69 && e.ctrlKey) {
				document.getElementById("commandbarinput").focus();
			}
		};

		const documentBody = document.getElementsByTagName('body')[0];
		console.log(documentBody);
		const customSearchBar = document.createElement("input");

		customSearchBar.setAttribute("id", "commandbarinput");
		customSearchBar.setAttribute("type", "text");
		customSearchBar.style.height = "40px";
		customSearchBar.style.width = "100%";
		customSearchBar.style.padding = "7px 10px";
		customSearchBar.style.fontSize = "14px";
		customSearchBar.style.border = "2px solid #68465f";
		customSearchBar.style.backgroundColor = "#F5F5F5";
		customSearchBar.style.color = "#666666";

		documentBody.prepend(customSearchBar);

		customSearchBar.addEventListener('keyup', function(e) {
			if (e.which === 13) {
				const currentValue = this.value.toUpperCase().trim();
				let typeOfSearch;
				let response;

				if (currentValue.match(/^[0-9]+$/)?.input) {
					fetchProduct(currentValue);
					return;
				}

				if (currentValue.startsWith("SOFR") || currentValue.startsWith("SODE") || currentValue.startsWith("SONL")) {
					fetchSofr(currentValue);
					return;
				}

				if (currentValue.startsWith("COM") || currentValue.startsWith("ORD") || currentValue.startsWith("BE")) {
					fetchCom(currentValue);
					return;
				}

				if (currentValue.startsWith("POXXL")) {
					fetchPoxxl(currentValue);
					return;
				}

                if (currentValue.includes("@")) {
                    fetchMail(currentValue);
                    return;
                }

                if (currentValue !== false) {
                    fetchName(currentValue);
                    return;
                }

				alert("Command not found");
			}
		});
	}, 3000);

	const baseUrl = 'https://xxlhoreca.myodoo.nl/web/dataset/search_read';
	const basePayload = {
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "en-US,en;q=0.9,fr;q=0.8",
			"content-type": "application/json",
			"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://xxlhoreca.myodoo.nl/web",
		"method": "POST",
		"credentials": "include"
	};

	const toUrl = function(id, action, model, menuId) {
		window.open(
			"https://xxlhoreca.myodoo.nl/web#action=" + action + "&cids=1&id=" + id + "&menu_id=" + menuId + "&model=" + model + "&view_type=form",
			'_blank'
		);
	};

	const fetchProduct = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"product.product\",\"domain\":[\"|\",\"|\",\"|\",\"|\",[\"default_code\",\"ilike\",\"" + currentValue + "\"],[\"product_variant_ids.default_code\",\"ilike\",\"" + currentValue + "\"],[\"name\",\"ilike\",\"" + currentValue + "\"],[\"barcode\",\"ilike\",\"" + currentValue + "\"],[\"sku\",\"ilike\",\"" + currentValue + "\"]],\"fields\":[\"default_code\",\"barcode\",\"sku\",\"ext_supplier_id\",\"name\",\"website_id\",\"product_template_attribute_value_ids\",\"company_id\",\"lst_price\",\"standard_price\",\"categ_id\",\"type\",\"price\",\"qty_available\",\"virtual_available\",\"uom_id\",\"product_tmpl_id\",\"active\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe\/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"bin_size\":true}},\"id\":867816732}"
		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 138, "product.template", 246);
		} else {
			alert("Does not exist");
		}
	};

	const fetchCom = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"external.website.order\",\"domain\":[\"|\",[\"name\",\"ilike\",\"" + currentValue + "\"],[\"payment_ref\",\"ilike\",\"" + currentValue + "\"]],\"fields\":[\"date_order\",\"name\",\"web_order_id\",\"type_id\",\"payment_state\",\"state\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"params\":{\"action\":755,\"cids\":1,\"menu_id\":542,\"model\":\"external.website.order\",\"view_type\":\"list\"},\"bin_size\":true}},\"id\":704652104}";

		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 755, "external.website.order", 542);
		} else {
			alert("Does not exist");
		}
	};

	const fetchSofr = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"sale.order\",\"domain\":[\"|\",\"|\",[\"name\",\"ilike\",\"" + currentValue + "\"],[\"client_order_ref\",\"ilike\",\"" + currentValue + "\"],[\"partner_id\",\"child_of\",\"" + currentValue + "\"]],\"fields\":[\"message_needaction\",\"name\",\"create_date\",\"commitment_date\",\"expected_date\",\"partner_id\",\"website_id\",\"user_id\",\"team_id\",\"warehouse_id\",\"company_id\",\"amount_untaxed\",\"amount_tax\",\"amount_total\",\"currency_id\",\"state\",\"invoice_status\",\"tag_ids\",\"activity_exception_decoration\",\"activity_exception_icon\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"params\":{\"action\":380,\"cids\":1,\"menu_id\":246,\"model\":\"sale.order\",\"view_type\":\"list\"},\"bin_size\":true}},\"id\":922969479}";

		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 380, "sale.order", 246);
		} else {
			alert("Does not exist");
		}
	};

	const fetchPoxxl = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"purchase.order\",\"domain\":[\"|\",\"|\",[\"name\",\"ilike\",\"" + currentValue + "\"],[\"partner_ref\",\"ilike\",\"" + currentValue + "\"],[\"partner_id\",\"child_of\",\"" + currentValue + "\"]],\"fields\":[\"message_unread\",\"partner_ref\",\"name\",\"date_order\",\"date_approve\",\"partner_id\",\"company_id\",\"date_planned\",\"user_id\",\"origin\",\"amount_untaxed\",\"amount_total\",\"currency_id\",\"state\",\"invoice_status\",\"activity_exception_decoration\",\"activity_exception_icon\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe\/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"quotation_only\":true,\"bin_size\":true}},\"id\":399485436}"
		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 513, "purchase.order", 347);
		} else {
			alert("Does not exist");
		}
	};

    const fetchMail = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"sale.order\",\"domain\":[[\"partner_id\",\"ilike\",\""+ currentValue +"\"]],\"fields\":[\"message_needaction\",\"name\",\"create_date\",\"commitment_date\",\"expected_date\",\"partner_id\",\"website_id\",\"user_id\",\"team_id\",\"warehouse_id\",\"company_id\",\"amount_untaxed\",\"amount_tax\",\"amount_total\",\"currency_id\",\"state\",\"invoice_status\",\"tag_ids\",\"activity_exception_decoration\",\"activity_exception_icon\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe\/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"bin_size\":true}},\"id\":927694673}"
		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 380, "sale.order", 246);
		} else {
			alert("Does not exist");
		}
	};

    const fetchName = async (currentValue, callback) => {
		let requestData = basePayload;
		requestData.body = "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"sale.order\",\"domain\":[\"|\",\"|\",[\"name\",\"ilike\",\""+ currentValue +"\"],[\"client_order_ref\",\"ilike\",\""+ currentValue +"\"],[\"partner_id\",\"child_of\",\""+ currentValue +"\"]],\"fields\":[\"message_needaction\",\"name\",\"create_date\",\"commitment_date\",\"expected_date\",\"partner_id\",\"website_id\",\"user_id\",\"team_id\",\"warehouse_id\",\"company_id\",\"amount_untaxed\",\"amount_tax\",\"amount_total\",\"currency_id\",\"state\",\"invoice_status\",\"tag_ids\",\"activity_exception_decoration\",\"activity_exception_icon\"],\"limit\":80,\"sort\":\"\",\"context\":{\"lang\":\"en_GB\",\"tz\":\"Europe\/Amsterdam\",\"uid\":101,\"allowed_company_ids\":[1],\"bin_size\":true}},\"id\":544386025}"
		let productData = await fetch(baseUrl, requestData);
		let jsonData = await productData.json();

		if (jsonData.result.records.length !== 0) {
			toUrl(jsonData.result.records[0].id, 380, "sale.order", 246);
		} else {
			alert("Does not exist");
		}
	};


})();
