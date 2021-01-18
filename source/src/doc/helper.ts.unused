export class Helper{
    // This function copies #text to the clipboard when run
    // from within an event handler.
    public static copyToClipboard(text)
    {
        if(typeof navigator.clipboard === "undefined"){
            // dummy text area
            let textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try
            {
                // actual copy
                document.execCommand('copy');
            }
            catch (err)
            {
                // ignore
            }

            // cleanup
            document.body.removeChild(textarea);
        }else{
            navigator.clipboard.writeText(text).catch(console.log);
        }
    }
}