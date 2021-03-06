﻿define(['jQuery'], function ($) {

    return function (view, params, tabContent) {

        var self = this;

        var data = {};
        function getPageData() {
            var key = getSavedQueryKey();
            var pageData = data[key];

            if (!pageData) {
                pageData = data[key] = {
                    query: {
                        SortBy: "SortName",
                        SortOrder: "Ascending",
                        IncludeItemTypes: "Audio,MusicVideo",
                        Recursive: true,
                        Fields: "DateCreated,SyncInfo,ItemCounts",
                        StartIndex: 0,
                        Limit: LibraryBrowser.getDefaultPageSize()
                    },
                    view: LibraryBrowser.getSavedView(key) || LibraryBrowser.getDefaultItemsView('Thumb', 'Thumb')
                };

                pageData.query.ParentId = LibraryMenu.getTopParentId();
                LibraryBrowser.loadSavedQueryValues(key, pageData.query);
            }
            return pageData;
        }

        function getQuery() {

            return getPageData().query;
        }

        function getSavedQueryKey() {

            return LibraryBrowser.getSavedQueryKey('genres');
        }

        function reloadItems(context) {

            Dashboard.showLoadingMsg();

            var query = getQuery();

            ApiClient.getMusicGenres(Dashboard.getCurrentUserId(), query).then(function (result) {

                // Scroll back up so they can see the results from the beginning
                window.scrollTo(0, 0);

                var html = '';

                var view = getPageData().view;

                $('.listTopPaging', context).html(LibraryBrowser.getQueryPagingHtml({
                    startIndex: query.StartIndex,
                    limit: query.Limit,
                    totalRecordCount: result.TotalRecordCount,
                    showLimit: false,
                    updatePageSizeSetting: false,
                    addLayoutButton: true,
                    currentLayout: view

                }));

                if (view == "Thumb") {
                    html = LibraryBrowser.getPosterViewHtml({
                        items: result.Items,
                        shape: "backdrop",
                        preferThumb: true,
                        showItemCounts: true,
                        context: 'music',
                        lazy: true,
                        centerText: true,
                        overlayPlayButton: true
                    });
                }
                else if (view == "ThumbCard") {

                    html = LibraryBrowser.getPosterViewHtml({
                        items: result.Items,
                        shape: "backdrop",
                        preferThumb: true,
                        context: 'music',
                        showItemCounts: true,
                        cardLayout: true,
                        lazy: true,
                        showTitle: true
                    });
                }
                else if (view == "Poster") {
                    html = LibraryBrowser.getPosterViewHtml({
                        items: result.Items,
                        shape: "portrait",
                        context: 'music',
                        centerText: true,
                        showItemCounts: true,
                        lazy: true
                    });
                }

                var elem = context.querySelector('#items');
                elem.innerHTML = html;
                ImageLoader.lazyChildren(elem);

                $('.btnNextPage', context).on('click', function () {
                    query.StartIndex += query.Limit;
                    reloadItems(context);
                });

                $('.btnPreviousPage', context).on('click', function () {
                    query.StartIndex -= query.Limit;
                    reloadItems(context);
                });

                $('.btnChangeLayout', context).on('layoutchange', function (e, layout) {
                    getPageData().view = layout;
                    LibraryBrowser.saveViewSetting(getSavedQueryKey(), layout);
                    reloadItems(context);
                });

                LibraryBrowser.saveQueryValues(getSavedQueryKey(), query);

                Dashboard.hideLoadingMsg();
            });
        }

        self.renderTab = function () {

            reloadItems(tabContent);
        };
    };

});