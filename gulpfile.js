var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');


/* TAREA DE CSS */

gulp.task ('css', function(){
    return gulp.src ('scss/**/*.scss') //busca el archivo original
        .pipe(sass())  //lo compila a sass
        .pipe(cssnano()) //minifico css
        .pipe(autoprefixer({ //autoprefixer, pongo los prefijos css.
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css')) // pregunto dónde lo dejo y entre paréntesis te digo en que ruta dejarlo, lo que crea el archivo directamente, en este caso app/css/main.css
        .pipe(browserSync.stream());
});


/* MINIFICAR JS */
 gulp.task('javascript', function (cb) {   //Tarea apara comprimir js
    pump([
          gulp.src('app/js/*.js'), //Ruta de donde está nuestro archivo a minificar
          uglify(),
          gulp.dest('app/js/dist') //Es donde le digo que me deje el archivo minificado
      ],
      cb
    );
  });

/* OPTIMIZAR IMAGENES, NO LA AÑADO EN LA TAREA DEFAULT PORQUE CONSUME MUCHOS RECURSOS, LA ETNGO QUE LLAMAR POR SEPARADO CUANDO QUIERA HACER UNA OPTIMIZACIÓN DE IMÁGENES.*/ 
  gulp.task('imagenes', function(){
    gulp.src('app/img/*') //Ruta de donde estan nuestas imágenes a optimizar
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))  //Es donde le digo que me deje el archivo optimizado
    }    
);
/*MINIFICAR HTML*/

gulp.task('html', function() {
    return gulp.src('./*.html') //Ruta donde está mi html.  El punto quiere decir la/el root del proyecto.
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('app'));//Ruta donde deja mi html minificado.
  });


/* TAREA DEFAULT, ES LA QUE VA A PONER EN MOVIMIENTO TODO NUESTRO GULP, CON PONER GULP EN LA CONSOLA BASTA YA QUE COGE LA TAREA DEFAULT SI NO LE INDICAMOS UNA TARREA ENESPECÍFICO. */
 gulp.task('default', ['css', 'javascript'], function() {
    browserSync.init({
        server: "./app" //Le estoy diciendo que el punto de inicio es la carpeta app.
    });
    gulp.watch("scss/**/*.scss", ['css']); //escucha lo que pasa en la carpeta/archivo que le indico y luego hace la tarea que le indico.
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("app/js/*.js", ['javascript']).on('change', browserSync.reload);
    gulp.watch("./*.html", ["html"]);
});


