const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass') (require('sass'));
const svgSprite = require('gulp-svg-sprite');
const fs = require('fs');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const concat = require('gulp-concat');
const clean = require('gulp-clean-css');

function htmlCompile() {
    return src('src/**/*.html')
    .pipe(dest('app/'));
}

function ttfToWoff() {
	// Ищем файлы шрифтов .ttf
	return src('src/fonts/*.ttf')
    // Конвертируем в .woff
    .pipe(fonter({
        formats: ['woff']
    }))
    // Выгружаем в папку с результатом
    .pipe(dest(`app/fonts/`))
    // Ищем файлы шрифтов .ttf
    .pipe(src('src/fonts/*.ttf'))
    // Конвертируем в .woff2
    .pipe(ttf2woff2())
    // Выгружаем в папку с результатом
    .pipe(dest('app/fonts/'))
    // Ищем файлы шрифтов .woff и woff2
    .pipe(src('src/fonts/*.{woff,woff2}'))
    // Выгружаем в папку с результатом
    .pipe(dest('app/fonts/'));
}

function fontsStyle() {
	// Файл стилей подключения шрифтов
	let fontsFile = 'src/scss/fonts.scss';
	// Проверяем существуют ли файлы шрифтов
	fs.readdir('app/fonts/', function (err, fontsFiles) {
		if (fontsFiles) {
			// Проверяем существует ли файл стилей для подключения шрифтов
			if (!fs.existsSync(fontsFile)) {
				// Если файла нет, создаем его
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					// Записываем подключения шрифтов в файл стилей
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						if (fontWeight.toLowerCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === 'bold') {
							fontWeight = 700;
						} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				// Если файл есть, выводим сообщение
				console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!");
			}
		}
	});

	return src('src');
	function cb() { }
}

function scss() {
    return src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('src/css/'));
}

function concatCss() {
    return src(['src/css/fonts.css','src/css/style.css','src/css/**/*.css'])
    .pipe(concat('style.css'))
    .pipe(dest('app/css/'))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css/'));
}

function cleanCss() {
    return src('app/css/style.min.css')
    .pipe(clean())
    .pipe(dest('app/css/'));
}

function jsCompile() {
    return src(['src/js/**/*.js','src/js/**/*.json'])
    .pipe(dest('app/js/'));
}

function svgCompile() {
    return src('src/svg/**/*.svg')
    .pipe(svgSprite({
        shape: {
            dimension: {
                maxWidth: 500,
                maxHeight: 500
            },
            spacing: {
                padding: 0
            },
            transform: [{
                "svgo": {
                    "plugins": [
                        { removeViewBox: false },
                        { removeUnusedNS: false },
                        { removeUselessStrokeAndFill: true },
                        { cleanupIDs: false },
                        { removeComments: true },
                        { removeEmptyAttrs: true },
                        { removeEmptyText: true },
                        { collapseGroups: true },
                        { removeAttrs: { attrs: '(fill|stroke|style)' } }
                    ]
                }
            }]
        },
        mode:{
            stack:{
                sprite: '../stack/sprite.svg',
                example: false
            },
            inline: true,
            symbol: {
                sprite: '../sprite.svg'
            },
        },
    }))
    .pipe(dest('app/images/'));
}

function imageCompile() {
    return src('src/images/**/*.*')
    .pipe(dest('app/images/'));
}

function watcher() {
    watch('src/scss/**/*.scss', scss);
    watch('src/css/**/*.css', concatCss);
    watch('app/css/style.css', cleanCss);
    watch('src/**/*.html', htmlCompile);
    watch(['src/js/**/*.js','src/js/**/*.json'], jsCompile);
}

exports.htmlCompile = htmlCompile;
exports.ttfToWoff = ttfToWoff;
exports.fontsStyle = fontsStyle;
exports.scss = scss;
exports.concatCss = concatCss;
exports.cleanCss = cleanCss;
exports.jsCompile = jsCompile;
exports.svgCompile = svgCompile;
exports.imageCompile = imageCompile;
exports.watcher = watcher;
exports.default = series(htmlCompile, ttfToWoff, fontsStyle, scss, concatCss, cleanCss, jsCompile, svgCompile, imageCompile, watcher);