import React from "react";
import Page from "../Page";
import { useParams } from "react-router-dom";
import { project, WikiPage as WikiPageObject, WikiContent } from "../../util/parsed";
import marked from "../../util/marked";
import { SectionContainer, Section } from "../Page/styles";
import Prism from "prismjs";
import "prismjs/components/prism-lua";

const WikiPage: React.FC<{}> = () => {
	const { tab, category } = useParams();
	const category_object = project[tab]?.subcategories?.[category];
	const item = category_object as WikiPageObject;
	const description = item.description;
	const content: WikiContent[] = item.content ?? [];

	function markedDescription() {
		return {
			__html: marked(description as string),
		};
	}

	function renderContent() {
		const elements: JSX.Element[] = [];
		let currentParagraph: string[] = [];

		const flushParagraph = () => {
			if (currentParagraph.length > 0) {
				const text = currentParagraph.join(" ");
				elements.push(
					<p
						key={`text-${elements.length}`}
						dangerouslySetInnerHTML={{ __html: marked(text) }}
					/>
				);
				currentParagraph = [];
			}
		};

		content.forEach((item, index) => {
			switch (item.type) {
				case "header":
					flushParagraph();
					elements.push(
						<Section key={`header-${index}`}>{item.content}</Section>
					);
					break;
				case "text":
					currentParagraph.push(item.content);
					break;
				case "br":
					flushParagraph();
					break;
				case "code":
					flushParagraph();
					const highlighted = Prism.highlight(
						item.content,
						Prism.languages.lua,
						"lua"
					);
					elements.push(
						<pre key={`code-${index}`} className="language-lua">
							<code
								className="language-lua"
								dangerouslySetInnerHTML={{ __html: highlighted }}
							/>
						</pre>
					);
					break;
			}
		});

		flushParagraph();
		return elements;
	}

	return (
		<Page title={item.name}>
			{description && (
				<>
					<Section>Description</Section>
					<SectionContainer
						dangerouslySetInnerHTML={markedDescription()}
					/>
				</>
			)}
			<SectionContainer>{renderContent()}</SectionContainer>
		</Page>
	);
};

export default WikiPage;
