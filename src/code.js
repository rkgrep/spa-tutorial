import $ from 'jquery'
import { compile } from 'handlebars'
import template from './html/code.handlebars'
import hljs from 'highlight.js'
import 'highlight.js/styles/darkula.css'

import code from 'raw-loader!../build/base.config.js'
hljs.initHighlightingOnLoad()

export default () => {
    let user = 'Jonh'
    $('#app').html(compile(template)({
        user,
        code,
    }))
}
