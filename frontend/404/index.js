function main() {
    const mainheader = document.getElementById("mainheader");
    const infoheader = document.getElementById("infoheader");

    mainheader.textContent = `Page "${window.location.pathname}" not found!`;
    infoheader.textContent = "Make sure the path is spelled right and exists";
}
main();