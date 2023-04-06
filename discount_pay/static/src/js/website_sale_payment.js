odoo.define('website_instant_discount.checkout', function(require){
    'use strict';

    require('web.dom_ready');
    var ajax = require('web.ajax');
    var core = require('web.core');
    var model = require('website_sale_delivery.checkout');
    var _t = core._t;

    console.log(model);

    var $pay_button = $('button[name="o_payment_submit_button"]');
    console.log($pay_button);

    function _onPayClick(ev) {
        console.log(ev);
        $pay_button.data('disabled_reasons', $pay_button.data('disabled_reasons') || {});
        $pay_button.data('disabled_reasons').carrier_selection = true;
        $pay_button.prop('disabled', true);

        const checkedRadio = $(ev.currentTarget).find('input[name="o_payment_radio"]')[0];
        // $(checkedRadio).prop('checked', true);
        var payment_id = $(checkedRadio).data('paymentOptionId');
        console.log(payment_id);
        var values = {'payment_id': payment_id};
        return ajax.jsonRpc(
            '/shop/update_payment', 
            'call',
             values
        ).then(function(data) {
            _onPaymentUpdateAnswer(data);
            // $('body').block({
            //     message: false,
            //     overlayCSS: {backgroundColor: "#000", opacity: 0, zIndex: 1050},
            // });
            
        });
    };

    function _onPaymentUpdateAnswer(result) {
	   console.log('Payment Change');
	   console.log(result);
        var $amount_delivery = $('#order_delivery span.oe_currency_value');
        var $amount_untaxed = $('#order_total_untaxed span.oe_currency_value');
        var $amount_tax = $('#order_total_taxes span.oe_currency_value');
        var $amount_total = $('#order_total span.oe_currency_value');
        var $discount = $('#order_discounted');
        var $amount_delivery = $('#order_payment span.oe_currency_value');

        if (result.status === true) {
            $amount_delivery.html(result.new_amount_delivery);
            $amount_untaxed.html(result.new_amount_untaxed);
            $amount_tax.html(result.new_amount_tax);
            $amount_total.html(result.new_amount_total);
            $amount_delivery.html(result.discount);
            $pay_button.data('disabled_reasons').carrier_selection = false;
            $pay_button.prop('disabled', _.contains($pay_button.data('disabled_reasons'), true));
        }
        else {
            $amount_delivery.html(result.new_amount_delivery);
            $amount_untaxed.html(result.new_amount_untaxed);
            $amount_tax.html(result.new_amount_tax);
            $amount_total.html(result.new_amount_total);
            $amount_delivery.html(result.discount);
        }
    };

    var $pays = $(".o_payment_option_card input[name='o_payment_radio']");
    // $pays.click(function(ev) {
    //     console.log(ev);
    //     _onPayClick(ev);
    // });

    console.log($pays);
    if ($pays.length > 0) {
        $pays.filter(':checked').click();
    }

    const publicWidget = require('web.public.widget');

    publicWidget.registry.PaymentCheckoutForm.include({
        _onClickPaymentOption: function(ev) {
            const checkedRadio = $(ev.currentTarget).find('input[name="o_payment_radio"]')[0];
            this._super.apply(this, arguments);
            var payment_id = $(checkedRadio).data('paymentOptionId');
            _onPayClick(ev).then(() => {
                let url = window.location.href;
                let ne = new URLSearchParams(window.location.search);
                ne.set('pm_id', payment_id);
                window.location.href = window.location.origin + window.location.pathname + '?' + ne.toString();
            })
        }
    });


    $(document).ready(function() {
        let url = window.location.href;
        if (url.indexOf("/shop/payment") !== -1) {
            let ne = new URLSearchParams(window.location.search);
            let pm_id = ne.get('pm_id');
            $(`[data-payment-option-id="${pm_id}"]`).prop('checked', true);
        }
    });

});
