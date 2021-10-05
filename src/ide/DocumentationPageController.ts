import { doc } from "./doc";
import { IPageController } from "./navigation";
import { searchengine } from "./search";

export default class DocumentationPageController implements IPageController {
	constructor(container: HTMLElement, location: URL) {
		doc.create(container);
		this.showPage(location.searchParams);
	}

	navigate(newLocation: URL): boolean {
		if (newLocation.searchParams.has("doc")) {
			this.showPage(newLocation.searchParams);
			return true;
		}

		return false;
	}

	private showPage(params: URLSearchParams): void {
		const docPage = params.get("doc") ?? "";
		if (docPage === "search") {
			const searchQuery = params.get("q") ?? "";
			const tokens = searchengine.tokenize(searchQuery);
			doc.setpath("search/" + tokens.join("/"));
		} else {
			doc.setpath(docPage);
		}
	}
}
