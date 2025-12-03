import React from "react";
import Page from "../Page";
import { useParams } from "react-router-dom";
import { project, WikiPage as WikiPageObject, WikiContent } from "../../util/parsed";
import marked from "../../util/marked";
import { SectionContainer, Section } from "../Page/styles";
import Prism from "prismjs";
import "prismjs/components/prism-lua";

const CODE_LANGUAGE = "lua";
const CODE_CLASS = `language-${CODE_LANGUAGE}`;

const renderCodeBlock = (code: string, key: string) => {
	const language = Prism.languages[CODE_LANGUAGE];
	const highlighted = language
		? Prism.highlight(code, language, CODE_LANGUAGE)
		: code;
	return (
		<pre key={key} className={CODE_CLASS}>
			<code
				className={CODE_CLASS}
				dangerouslySetInnerHTML={{ __html: highlighted }}
			/>
		</pre>
	);
};

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
					elements.push(renderCodeBlock(item.content, `code-${index}`));
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
