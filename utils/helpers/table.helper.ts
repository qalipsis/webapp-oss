export class TableHelper {
    static defaultPageSize = 10;

    static getSanitizedQuery = (query: string): string => {
        /**
         * Steps for sanitizing the query
         * 1. trims the spaces
         * 2. removes the double quotation
         * 3. replaces the white spaces to comma
         * 4. splits the query by comma
         * 5. trims the space of each value in the query
         * 6. filters the empty value
         * 7. join the text by comma
         */ 
        return query
            .trim()
            .replace(/"/g, '')
            .replace(/ /g, ',')
            .split(',')
            .map(text => text.trim())
            .filter(text => text)
            .join(',')
    }
}