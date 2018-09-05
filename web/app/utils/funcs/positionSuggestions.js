function positionSuggestions({state, props}) {

    document
        .getElementsByClassName(props.theme.mentionSuggestions)[0]
        .removeAttribute('style');

    const activeElement = document.getSelection().focusNode.parentNode;
    const {top, left} = activeElement.getBoundingClientRect();

    let styles = {
        top: top + 'px',
        left:  left + 'px'
    };

    const mentionSuggestions = document.getElementsByClassName(props.theme.mentionSuggestions)[0];
    const innerHeight = window.innerHeight || document.body.clientHeight;

    const bottomDistance = innerHeight - (top + mentionSuggestions.offsetHeight);

    if (state.isActive & props.suggestions.size > 0) {
        styles.transform = 'scaleY(1)';
        styles.transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
        if (bottomDistance < 31) {
            styles.top = (top - mentionSuggestions.offsetHeight - 31) + 'px';
        } else {
            styles.top = top + 'px';
        }
    } else if (state.isActive) {
        styles.transform = 'scaleY(0)';
        styles.transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
    }

    return styles;
}

export default positionSuggestions