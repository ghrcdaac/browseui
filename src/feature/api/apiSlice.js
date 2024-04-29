//handles api calls for search

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: config.cloudWatchUrlBase}),
    tagTypes: ['grans'],
    endpoints: builder => ({
        getGranSearch: builder.query({
            query: ({ search, delim, pageToken }) => ({
                url: `/?list-type=2&delimiter=${delim}&prefix=${search}${pageToken ? `&continuation-token=${encodeURIComponent(pageToken)}` : ''}`,
                responseHandler: (response) => response.text(),
            }),
        }),
    })
})

export const {
    useGetGranSearchQuery,
} = apiSlice;

