import './styles/main.css'
import './styles/theme.scss'

import $ from 'jquery'
import 'bootstrap'
import Navigo from 'navigo'

const router = new Navigo()

const HomePage = () => System.import('./home').then(module => module.default())
const AboutPage = () => System.import('./about').then(module => module.default())

router
    .on('/', HomePage)
    .on('/about', AboutPage)
    .resolve()

$(window).on('load', () => {
    $(document).on('click', '[data-path]', (e) => {
        e.preventDefault()
        router.navigate($(e.target).attr('href'))
    })
})
