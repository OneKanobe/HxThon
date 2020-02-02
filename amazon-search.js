var amazonSearchModule = (function() {

    /// Gets page data, given a Url
    /// Returns a promise
    function privateGetPage(url) {
        let dfd = jQuery.Deferred();

        jQuery.get(url, function() {

        })
        .done(function(data, status) {
            return dfd.resolve(data);
        });

        return dfd.promise();
    }

    /// Scrapes the html from an Amazon search results page and returns an array of products.
    /// Product properties: imgUrl, itemUrl, asin, title, price
    function privateGetProducts(data) {
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

    /// Returns an Amazon search page Url
    function privateGetSearchUrl(searchTerm) {
        let searchUrlBase = 'https://www.amazon.com/';
        let searchUrlTerm = 's?k=' + productTitle + '&';
        let searchUrlMerchant = 'i=wholefoods';

        return searchUrlBase + searchUrlTerm + searchUrlMerchant;
    }

    /// Get the title from the details page
    function privateGetProductTitle() {
        if(jQuery('#productTitle')[0] !== null) {
            let title = jQuery('#productTitle')[0].innerText.trim();
            let lastIndex = title.lastIndexOf(',');
            if (lastIndex !== -1) {
                title = title.substring(0, lastIndex);
                return title;
            } else return title;
        } else return null;
    }

    /// Keys the products keywords
    function privateGetProductKeywords(maxResults) {
        let keywords = jQuery('meta[name="keywords"]').attr('content');
        return keywords.split(',').slice(0, maxResults);
    }

    function privateGetProductAsin() {
        return jQuery('.edp-feature-declaration').attr('data-edp-asin');
    }



    // === Public Methods === \\    

    /// Give a search term, returns the amazon search page url
    function getSearchUrl(searchTerm) {
        return privateGetSearchUrl(searchTerm);
    }

    /// Must be run on the product details page. Returns the product's title
    function getProductTitle() {
        return privateGetProductTitle();
    }

    /// Given the url to an Amazon search page, returns an array of products on that page.
    /// Product properties: imgUrl, itemUrl, asin, title, price
    function getProducts(url) {
        privateGetPage(url).then(function(result) {
            if (result !== null) {
                let recs = privateGetProducts(result);
                console.log(recs);
            } else return null;
        });
    }

    /// Must be run on product details page.
    /// Returns up to maxResults number of keywords for the product
    function getProductKeywords(maxResults) {
        return privateGetProductKeywords(maxResults);
    }

    /// Must be run on product details page.
    /// Returns the product's Asin.
    function getProductAsin() {
        return privateGetProductAsin();
    }

    // Reveal public methods here
    return {
        getProducts: getProducts,
        getSearchUrl: getSearchUrl,
        getProductTitle: getProductTitle,
        getProductKeywords: getProductKeywords,
        getProductAsin: getProductAsin
    };

}) ();

