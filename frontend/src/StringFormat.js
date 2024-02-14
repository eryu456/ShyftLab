function StringFormat(string) {
    const updatedString = string.trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    return (
        updatedString.join(" ")
    )
}

export default StringFormat;