module.exports = {
    plugins: [
        require('postcss-easy-import')({
            'path': ['themes/lasimple/src/css/'],
            'prefix': '_',
            'extension': 'css'
        }),
        require('postcss-preset-env')({
            stage:0
        }),
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