import Inferno from "inferno";
import VNodeFlags from "inferno-vnode-flags";

export const createChart = (cb, props) => (
    Inferno.createVNode(VNodeFlags.ComponentUnknown, Canvas, props, null, null, null, {
        onComponentDidMount: function(el) {
            cb(el);
        },
    })
);

const Canvas = props => Inferno.createVNode(VNodeFlags.HtmlElement, "canvas", props);
