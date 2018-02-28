module.exports = {
    plugins: [
        require('postcss-easy-import')({
            'path': ['themes/lasimple/static/css/'],
            'prefix': '_',
            'extension': 'css'
        }),
        require('postcss-cssnext'),
        require('postcss-font-magician')({
            foundries: ['google'],
             variants: {
                 'Open Sans': {
                     '300': [],
                     '600': []
                 },
                 'Roboto Mono': {
                     '100': [],
                     '300': []
                 }
             },
        })
    ]
};