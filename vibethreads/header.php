<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header>
    <img src="<?php echo esc_url( get_template_directory_uri() . '/cebastianco_name_mark_logo_gold.jpeg' ); ?>" alt="Cebastian Co. Logo">
    <h1>New Drops, No Excuses</h1>
    <button class="cta">Shop The Hype</button>
</header>
<nav>
    <a href="#categories">Categories</a>
    <a href="#featured">Featured</a>
    <a href="#about">About</a>
    <a href="#testimonials">Testimonials</a>
    <a href="#newsletter">Newsletter</a>
</nav>
