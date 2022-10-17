//handles api calls for search

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../../config'

const buildUrl = (search, delim) => {
    if (search[0] === '/' || delim === '/'){return `${config.cloudWatchUrlBase}?delimiter=${delim}&prefix=${search}`}
    else {return `http://localhost:3001/${search}`}
}
const processResp = (resp, search, delim) => {
    if (search[0] === '/' || delim === '/'){return resp.text()}
    else {return resp.json()}
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: ''}),
    tagTypes: ['grans'],
    endpoints: builder => ({
        getGranSearch: builder.query({
            query: ({ search, delim }) => ({
                url: `${buildUrl(search, delim)}`,
                responseHandler: (response) => processResp(response, search, delim),
            }),
        }),
    })
})

export const {
    useGetGranSearchQuery,
} = apiSlice