# -*- coding: utf-8 -*-

from odoo import models, fields, api


class PaymentAcquier(models.Model):
    _inherit = 'payment.acquirer'

    discount = fields.Float('Discount')
    product_discount = fields.Many2one('product.product', 'Product')


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    payment_discount = fields.Float('Discount per Payment Method', default=0)
    payment_id = fields.Many2one('payment.acquirer', 'Payment Method')


class ProductProduct(models.Model):
    _inherit = 'product.product'

    is_payment = fields.Boolean('Is Payment Method')
