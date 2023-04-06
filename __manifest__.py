# -*- coding: utf-8 -*-
{
    'name': "Website Instant Discount",
    'summary': """""",
    'description': """""",
    'category': 'Uncategorized',
    'version': '0.2',
    "author": 'Zeynel',
    "website": 'https://coflow.com.tr',
    'depends': ['base', 'website_sale', 'website_sale_delivery'],
    'data': [
        'views/views.xml',
        'views/templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_instant_discount/static/src/js/website_sale_payment.js'
        ],
    },
    'images': [],
    'license': "OPL-1",
    "auto_install": False,
    "installable": True,
}
