<?php
function vibethreads_enqueue_assets() {
    wp_enqueue_style('vibethreads-style', get_stylesheet_uri());
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;800&display=swap', [], null);
    wp_enqueue_style('vibethreads-landing', get_template_directory_uri() . '/assets/css/landing.css', ['vibethreads-style'], '1.0');
    wp_enqueue_script('vibethreads-landing', get_template_directory_uri() . '/assets/js/landing.js', [], '1.0', true);
}
add_action('wp_enqueue_scripts', 'vibethreads_enqueue_assets');
?>
