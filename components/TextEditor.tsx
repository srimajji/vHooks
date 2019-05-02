import AceEditor from "react-ace";
import "brace/theme/monokai";
import "brace/mode/javascript";

const TextEditor = ({ value, onChange, onValidate }) => (
	<div>
		<AceEditor
			mode="javascript"
			theme="monokai"
			onChange={onChange}
			onValidate={onValidate}
			value={value}
			name="textEditorAce"
			editorProps={{
				$blockScrolling: true
			}}
			fontSize={12}
			height="40vh"
			width="100%"
		/>
	</div>
);

export default TextEditor;
