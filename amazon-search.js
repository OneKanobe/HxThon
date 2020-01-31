var amazonSearchModule = (function() {

    /// Gets page data, given a Url
    /// Returns a promise
    function getPage(url) {
        let dfd = jQuery.Deferred();

        jQuery.get(url, function() {

        })
        .done(function(data, status) {
            return dfd.resolve(data);
        });

        return dfd.promise();
    }

    function getProducts(data) {
        let products = [];

        let doc = new DOMParser().parseFromString(data, 'text/html');
        let searchResultNodes = doc.getElementsByClassName('s-result-item');

        // Get the product info we'll need to display the recs later
        jQuery(searchResultNodes).each(function(index) {
            let product = {
                imgUrl: jQuery(this).find('img').attr('src'),
                itemUrl: jQuery(this).find('.a-text-normal').attr('href'),
                asin: jQuery(this).attr('data-asin'),
                title: jQuery(this).find('.a-text-normal')[0] !== undefined ? jQuery(this).find('.a-text-normal')[0].innerText.trim() : "",
                price: jQuery(this).find('.a-price').find('.a-offscreen')[0] !== undefined ? jQuery(this).find('.a-price').find('.a-offscreen')[0].innerText : "",
            };
            products.push(product);
        });

        // Remove the first entry. Chances are, it's the product that customer is already looking at
        products.shift();
        return products;
    }

    function publicGetProducts(url) {
        getPage(url).then(function(result) {
            if (result !== null) {
                let recs = getProducts(result);
                console.log(recs);
            } else return null;
        });
    }

    return {
        getProducts: publicGetProducts
    };

}) ();

