import {
	Directive,
	ElementRef,
	HostBinding,
	Input,
	OnInit
} from "@angular/core";
import ButtonConfig from "@carbon/spec/components/button/button-config.js";

/**
 * TODO SPEC
 * - instead of a directive, we need a component so we can use a template to set element type
 * - define prefix somewhere
 * - better way to set attributes?
 */

/**
 * A convinence directive for applying styling to a button.
 *
 * Example:
 *
 * ```hmtl
 * <button ibmButton>A button</button>
 * <button ibmButton="secondary">A secondary button</button>
 * ```
 *
 * See the [vanilla carbon docs](http://www.carbondesignsystem.com/components/button/code) for more detail.
 */
@Directive({
	selector: "[ibmButton]"
})
export class Button implements OnInit {
	@Input() ibmButton:
		| "primary"
		| "secondary"
		| "tertiary"
		| "ghost"
		| "danger"
		| "dangerPrimary" = "primary";

	@Input() size: "normal" | "sm" = "normal";

	@HostBinding("class") classes = "";

	constructor(protected elementRef: ElementRef) {}

	ngOnInit() {
		const config = ButtonConfig("bx");

		const button = config.generate({
			size: this.size === "sm" ? "small" : "",
			variant: this.ibmButton || "primary"
		});

		this.classes = button.classes.root;

		for (let key in button.attributes) {
			if (button.attributes.hasOwnProperty(key)) {
				this.elementRef.nativeElement.setAttribute(
					key,
					button.attributes[key]
				);
			}
		}
	}
}
