document.addEventListener('DOMContentLoaded', () => {
    const cta = document.querySelector('.cta');
    if (cta) {
        cta.addEventListener('click', () => {
            document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
