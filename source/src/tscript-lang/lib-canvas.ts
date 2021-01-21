import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "../tscript";
import { Typeid } from "../helpers/typeIds";
import { tscipt_canvas } from "./lib-canvas.tscript";

export const lib_canvas = {
    source: tscipt_canvas,
    "impl": {
        "canvas": {
                "width": function() {
                    let ret = this.service.canvas.width.call(this.service);
                    return {"type": this.program.types[Typeid.typeid_integer], "value": {"b": ret}};
                },
                "height": function() {
                    let ret = this.service.canvas.height.call(this.service);
                    return {"type": this.program.types[Typeid.typeid_integer], "value": {"b": ret}};
                },
                "setLineWidth": function(width) {
                    if (! TScript.isNumeric(width.type)) ErrorHelper.error("/argument-mismatch/am-1", ["width", "canvas.setLineWidth", "numeric argument", TScript.displayname(width.type)]);
                    if (width.value.b <= 0) ErrorHelper.error("/user/ue-2", ["error in canvas.setLineWidth; width must be positive"]);
                    this.service.canvas.setLineWidth.call(this.service, width.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "setLineColor": function(red, green, blue, alpha) {
                    if (! TScript.isNumeric(red.type))   ErrorHelper.error("/argument-mismatch/am-1", ["red",   "canvas.setLineColor", "numeric argument", TScript.displayname(red.type)]);
                    if (! TScript.isNumeric(green.type)) ErrorHelper.error("/argument-mismatch/am-1", ["green", "canvas.setLineColor", "numeric argument", TScript.displayname(green.type)]);
                    if (! TScript.isNumeric(blue.type))  ErrorHelper.error("/argument-mismatch/am-1", ["blue",  "canvas.setLineColor", "numeric argument", TScript.displayname(blue.type)]);
                    if (! TScript.isNumeric(alpha.type)) ErrorHelper.error("/argument-mismatch/am-1", ["alpha", "canvas.setLineColor", "numeric argument", TScript.displayname(alpha.type)]);
                    this.service.canvas.setLineColor.call(this.service, red.value.b, green.value.b, blue.value.b, alpha.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "setFillColor": function(red, green, blue, alpha) {
                    if (! TScript.isNumeric(red.type))   ErrorHelper.error("/argument-mismatch/am-1", ["red",   "canvas.setFillColor", "numeric argument", TScript.displayname(red.type)]);
                    if (! TScript.isNumeric(green.type)) ErrorHelper.error("/argument-mismatch/am-1", ["green", "canvas.setFillColor", "numeric argument", TScript.displayname(green.type)]);
                    if (! TScript.isNumeric(blue.type))  ErrorHelper.error("/argument-mismatch/am-1", ["blue",  "canvas.setFillColor", "numeric argument", TScript.displayname(blue.type)]);
                    if (! TScript.isNumeric(alpha.type)) ErrorHelper.error("/argument-mismatch/am-1", ["alpha", "canvas.setFillColor", "numeric argument", TScript.displayname(alpha.type)]);
                    this.service.canvas.setFillColor.call(this.service, red.value.b, green.value.b, blue.value.b, alpha.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "setFont": function(fontface, fontsize) {
                    if (! TScript.isDerivedFrom(fontface.type, Typeid.typeid_string)) ErrorHelper.error("/argument-mismatch/am-1", ["fontface", "canvas.setFont", "string", TScript.displayname(fontface.type)]);
                    if (! TScript.isNumeric(fontsize.type)) ErrorHelper.error("/argument-mismatch/am-1", ["fontsize", "canvas.setFont", "numeric argument", TScript.displayname(fontsize.type)]);
                    if (fontsize.value.b <= 0) ErrorHelper.error("/user/ue-2", ["error in canvas.setFont; fontsize must be positive"]);
                    this.service.canvas.setFont.call(this.service, fontface.value.b, fontsize.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "setTextAlign": function(alignment) {
                    if (! TScript.isDerivedFrom(alignment.type, Typeid.typeid_string)) ErrorHelper.error("/argument-mismatch/am-1", ["alignment", "canvas.setTextAlign", "string", TScript.displayname(alignment.type)]);
                    let a = alignment.value.b;
                    if (a !== "left" && a !== "center" && a !== "right") ErrorHelper.error("/user/ue-2", ["error in canvas.setTextAlign; invalid alignment value"]);
                    this.service.canvas.setTextAlign.call(this.service, alignment.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "clear": function() {
                    this.service.canvas.clear.call(this.service);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "line": function(x1, y1, x2, y2) {
                    if (! TScript.isNumeric(x1.type)) ErrorHelper.error("/argument-mismatch/am-1", ["x1", "canvas.line", "numeric argument", TScript.displayname(x1.type)]);
                    if (! TScript.isNumeric(y1.type)) ErrorHelper.error("/argument-mismatch/am-1", ["y1", "canvas.line", "numeric argument", TScript.displayname(y1.type)]);
                    if (! TScript.isNumeric(x2.type)) ErrorHelper.error("/argument-mismatch/am-1", ["x2", "canvas.line", "numeric argument", TScript.displayname(x2.type)]);
                    if (! TScript.isNumeric(y2.type)) ErrorHelper.error("/argument-mismatch/am-1", ["y2", "canvas.line", "numeric argument", TScript.displayname(y2.type)]);
                    this.service.canvas.line.call(this.service, x1.value.b, y1.value.b, x2.value.b, y2.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "rect": function(left, top, width, height) {
                    if (! TScript.isNumeric(left.type))   ErrorHelper.error("/argument-mismatch/am-1", ["left",   "canvas.rect", "numeric argument", TScript.displayname(left.type)]);
                    if (! TScript.isNumeric(top.type))    ErrorHelper.error("/argument-mismatch/am-1", ["top",    "canvas.rect", "numeric argument", TScript.displayname(top.type)]);
                    if (! TScript.isNumeric(width.type))  ErrorHelper.error("/argument-mismatch/am-1", ["width",  "canvas.rect", "numeric argument", TScript.displayname(width.type)]);
                    if (! TScript.isNumeric(height.type)) ErrorHelper.error("/argument-mismatch/am-1", ["height", "canvas.rect", "numeric argument", TScript.displayname(height.type)]);
                    this.service.canvas.rect.call(this.service, left.value.b, top.value.b, width.value.b, height.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "fillRect": function(left, top, width, height) {
                    if (! TScript.isNumeric(left.type))   ErrorHelper.error("/argument-mismatch/am-1", ["left",   "canvas.fillRect", "numeric argument", TScript.displayname(left.type)]);
                    if (! TScript.isNumeric(top.type))    ErrorHelper.error("/argument-mismatch/am-1", ["top",    "canvas.fillRect", "numeric argument", TScript.displayname(top.type)]);
                    if (! TScript.isNumeric(width.type))  ErrorHelper.error("/argument-mismatch/am-1", ["width",  "canvas.fillRect", "numeric argument", TScript.displayname(width.type)]);
                    if (! TScript.isNumeric(height.type)) ErrorHelper.error("/argument-mismatch/am-1", ["height", "canvas.fillRect", "numeric argument", TScript.displayname(height.type)]);
                    this.service.canvas.fillRect.call(this.service, left.value.b, top.value.b, width.value.b, height.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "frameRect": function(left, top, width, height) {
                    if (! TScript.isNumeric(left.type))   ErrorHelper.error("/argument-mismatch/am-1", ["left",   "canvas.frameRect", "numeric argument", TScript.displayname(left.type)]);
                    if (! TScript.isNumeric(top.type))    ErrorHelper.error("/argument-mismatch/am-1", ["top",    "canvas.frameRect", "numeric argument", TScript.displayname(top.type)]);
                    if (! TScript.isNumeric(width.type))  ErrorHelper.error("/argument-mismatch/am-1", ["width",  "canvas.frameRect", "numeric argument", TScript.displayname(width.type)]);
                    if (! TScript.isNumeric(height.type)) ErrorHelper.error("/argument-mismatch/am-1", ["height", "canvas.frameRect", "numeric argument", TScript.displayname(height.type)]);
                    this.service.canvas.frameRect.call(this.service, left.value.b, top.value.b, width.value.b, height.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "circle": function(x, y, radius) {
                    if (! TScript.isNumeric(x.type))      ErrorHelper.error("/argument-mismatch/am-1", ["x",      "canvas.circle", "numeric argument", TScript.displayname(x.type)]);
                    if (! TScript.isNumeric(y.type))      ErrorHelper.error("/argument-mismatch/am-1", ["y",      "canvas.circle", "numeric argument", TScript.displayname(y.type)]);
                    if (! TScript.isNumeric(radius.type)) ErrorHelper.error("/argument-mismatch/am-1", ["radius", "canvas.circle", "numeric argument", TScript.displayname(radius.type)]);
                    this.service.canvas.circle.call(this.service, x.value.b, y.value.b, radius.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "fillCircle": function(x, y, radius) {
                    if (! TScript.isNumeric(x.type))      ErrorHelper.error("/argument-mismatch/am-1", ["x",      "canvas.fillCircle", "numeric argument", TScript.displayname(x.type)]);
                    if (! TScript.isNumeric(y.type))      ErrorHelper.error("/argument-mismatch/am-1", ["y",      "canvas.fillCircle", "numeric argument", TScript.displayname(y.type)]);
                    if (! TScript.isNumeric(radius.type)) ErrorHelper.error("/argument-mismatch/am-1", ["radius", "canvas.fillCircle", "numeric argument", TScript.displayname(radius.type)]);
                    this.service.canvas.fillCircle.call(this.service, x.value.b, y.value.b, radius.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "frameCircle": function(x, y, radius) {
                    if (! TScript.isNumeric(x.type))      ErrorHelper.error("/argument-mismatch/am-1", ["x",      "canvas.frameCircle", "numeric argument", TScript.displayname(x.type)]);
                    if (! TScript.isNumeric(y.type))      ErrorHelper.error("/argument-mismatch/am-1", ["y",      "canvas.frameCircle", "numeric argument", TScript.displayname(y.type)]);
                    if (! TScript.isNumeric(radius.type)) ErrorHelper.error("/argument-mismatch/am-1", ["radius", "canvas.frameCircle", "numeric argument", TScript.displayname(radius.type)]);
                    this.service.canvas.frameCircle.call(this.service, x.value.b, y.value.b, radius.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "curve": function(points, closed) {
                    if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points", "canvas.curve", "array", TScript.displayname(points.type)]);
                    if (! TScript.isDerivedFrom(closed.type, Typeid.typeid_boolean)) ErrorHelper.error("/argument-mismatch/am-1", ["closed", "canvas.curve", "boolean", TScript.displayname(closed.type)]);
                    let list = new Array();
                    for (let i=0; i<points.value.b.length; i++)
                    {
                        let p = points.value.b[i];
                        if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.curve", "array", TScript.displayname(p.type)]);
                        if (p.value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.curve; point[" + i + "] must be an array of size two."]);
                        let x = p.value.b[0];
                        let y = p.value.b[1];
                        if (! TScript.isNumeric(x.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.curve", "numeric argument", TScript.displayname(x.type)]);
                        if (! TScript.isNumeric(y.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.curve", "numeric argument", TScript.displayname(y.type)]);
                        list.push([x.value.b, y.value.b]);
                    }
                    this.service.canvas.curve.call(this.service, list, closed.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "fillArea": function(points) {
                    if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points", "canvas.fillArea", "array", TScript.displayname(points.type)]);
                    let list = new Array();
                    for (let i=0; i<points.value.b.length; i++)
                    {
                        let p = points.value.b[i];
                        if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.fillArea", "array", TScript.displayname(p.type)]);
                        if (p.value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.fillArea; point[" + i + "] must be an array of size two."]);
                        let x = p.value.b[0];
                        let y = p.value.b[1];
                        if (! TScript.isNumeric(x.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.fillArea", "numeric argument", TScript.displayname(x.type)]);
                        if (! TScript.isNumeric(y.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.fillArea", "numeric argument", TScript.displayname(y.type)]);
                        list.push([x.value.b, y.value.b]);
                    }
                    this.service.canvas.fillArea.call(this.service, list);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "frameArea": function(points) {
                    if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points", "canvas.frameArea", "array", TScript.displayname(points.type)]);
                    let list = new Array();
                    for (let i=0; i<points.value.b.length; i++)
                    {
                        let p = points.value.b[i];
                        if (! TScript.isDerivedFrom(points.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.frameArea", "array", TScript.displayname(p.type)]);
                        if (p.value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.frameArea; point[" + i + "] must be an array of size two."]);
                        let x = p.value.b[0];
                        let y = p.value.b[1];
                        if (! TScript.isNumeric(x.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.frameArea", "numeric argument", TScript.displayname(x.type)]);
                        if (! TScript.isNumeric(y.type)) ErrorHelper.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.frameArea", "numeric argument", TScript.displayname(y.type)]);
                        list.push([x.value.b, y.value.b]);
                    }
                    this.service.canvas.frameArea.call(this.service, list);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "text": function(x, y, str) {
                    if (! TScript.isNumeric(x.type)) ErrorHelper.error("/argument-mismatch/am-1", ["x", "canvas.text", "numeric argument", TScript.displayname(x.type)]);
                    if (! TScript.isNumeric(y.type)) ErrorHelper.error("/argument-mismatch/am-1", ["y", "canvas.text", "numeric argument", TScript.displayname(y.type)]);
                    this.service.canvas.text.call(this.service, x.value.b, y.value.b, TScript.toString(str));
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "reset": function() {
                    this.service.canvas.reset.call(this.service);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "shift": function(dx, dy) {
                    if (! TScript.isNumeric(dx.type)) ErrorHelper.error("/argument-mismatch/am-1", ["dx", "canvas.shift", "numeric argument", TScript.displayname(dx.type)]);
                    if (! TScript.isNumeric(dy.type)) ErrorHelper.error("/argument-mismatch/am-1", ["dy", "canvas.shift", "numeric argument", TScript.displayname(dy.type)]);
                    this.service.canvas.shift.call(this.service, dx.value.b, dy.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "scale": function(factor) {
                    if (! TScript.isNumeric(factor.type)) ErrorHelper.error("/argument-mismatch/am-1", ["factor", "canvas.scale", "numeric argument", TScript.displayname(factor.type)]);
                    this.service.canvas.scale.call(this.service, factor.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "rotate": function(angle) {
                    if (! TScript.isNumeric(angle.type)) ErrorHelper.error("/argument-mismatch/am-1", ["angle", "canvas.rotate", "numeric argument", TScript.displayname(angle.type)]);
                    this.service.canvas.rotate.call(this.service, angle.value.b);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
                "transform": function(A, b) {
                    if (! TScript.isDerivedFrom(A.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["A", "canvas.transform", "array", TScript.displayname(A.type)]);
                    if (! TScript.isDerivedFrom(b.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["b", "canvas.transform", "array", TScript.displayname(b.type)]);
                    if (A.value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.transform; A must be an array of size two."]);
                    if (A.value.b[0].value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.transform; A[0] must be an array of size two."]);
                    if (A.value.b[1].value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.transform; A[1] must be an array of size two."]);
                    if (! TScript.isNumeric(A.value.b[0].value.b[0].type)) ErrorHelper.error("/argument-mismatch/am-1", ["A[0][0]", "canvas.transform", "numeric argument", TScript.displayname(A.value.b[0].value.b[0].type)]);
                    if (! TScript.isNumeric(A.value.b[0].value.b[1].type)) ErrorHelper.error("/argument-mismatch/am-1", ["A[0][1]", "canvas.transform", "numeric argument", TScript.displayname(A.value.b[0].value.b[1].type)]);
                    if (! TScript.isNumeric(A.value.b[1].value.b[0].type)) ErrorHelper.error("/argument-mismatch/am-1", ["A[1][0]", "canvas.transform", "numeric argument", TScript.displayname(A.value.b[1].value.b[0].type)]);
                    if (! TScript.isNumeric(A.value.b[1].value.b[1].type)) ErrorHelper.error("/argument-mismatch/am-1", ["A[1][1]", "canvas.transform", "numeric argument", TScript.displayname(A.value.b[1].value.b[1].type)]);
                    if (b.value.b.length !== 2) ErrorHelper.error("/user/ue-2", ["error in canvas.transform; b must be an array of size two."]);
                    if (! TScript.isNumeric(b.value.b[0].type)) ErrorHelper.error("/argument-mismatch/am-1", ["b[0]", "canvas.transform", "numeric argument", TScript.displayname(b.value.b[0].type)]);
                    if (! TScript.isNumeric(b.value.b[1].type)) ErrorHelper.error("/argument-mismatch/am-1", ["b[1]", "canvas.transform", "numeric argument", TScript.displayname(b.value.b[1].type)]);
                    this.service.canvas.transform.call(this.service,
                            [[A.value.b[0].value.b[0].value.b, A.value.b[0].value.b[1].value.b],
                             [A.value.b[1].value.b[0].value.b, A.value.b[1].value.b[1].value.b]],
                            [b.value.b[0].value.b, b.value.b[1].value.b]);
                    return {"type": this.program.types[Typeid.typeid_null], "value": {"b": null}};
                },
        },
    },
};