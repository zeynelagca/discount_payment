# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale

import logging

_logger = logging.getLogger(__name__)


class WebsiteSalePaymentDiscount(WebsiteSale):

	@http.route(['/shop/update_payment'], type='json', auth='public', methods=['POST'], website=True, csrf=False)
	def update_eshop_payment(self, **post):
		results = {}
		results = self._add_website_sale_payment(**post)
		return results

	def _add_website_sale_payment(self, **post):
		Monetary = request.env['ir.qweb.field.monetary']
		order = request.website.sale_get_order()

		for line in order.order_line:
                        if line.product_id.is_payment:
                                request.env['sale.order.line'].sudo().browse(line.id).unlink()
                                # self.cart_update_json(line.product_id.id, line_id=line.id, add_qty=0)


		payment_id = int(post['payment_id'])
		currency = order.currency_id
		discount = request.env['payment.acquirer'].sudo().search([('id', '=', payment_id)])
		_logger.info(f"---------------{discount, order.state}")
		amount_discount = (discount.discount * order.amount_total) / 100
		order.payment_id = payment_id
		order.payment_discount = amount_discount * -1

		if discount.product_discount:
			# self.cart_update_json(
			# 	discount.product_discount.id,
			# 	add_qty=1,
			# 	)
			sale = request.env['sale.order.line'].sudo().create({
                           'product_id': discount.product_discount.id,
                           'name': 'Discount per Payment Method',
                           'product_uom_qty': 1,
                           'price_unit': amount_discount * -1,
                           'order_id': order.id,
                           'customer_lead': 0,
                           # 'is_payment': True,
			})
		_logger.info(f"---------------{order.amount_total}")

		return {
			'status': True,
			'discount': Monetary.value_to_html(order.payment_discount, {'display_currency': currency}),
			'new_amount_delivery': order.amount_delivery,
			'new_amount_untaxed': order.amount_untaxed,
			'new_amount_tax': order.amount_tax,
			'new_amount_total': order.amount_total,
		}


	# @http.route('/shop/payment', type='http', auth='public', website=True, sitemap=False)
	# def shop_payment(self, **post):
	# 	res = super().shop_payment(**post)
	# 	res.qcontext.update({})



