class chat{
    constructor(id, text, author, date=new Date(), answer=null) {
        this.id=id;
        this.text=text;
        this.author=author;
        this.date=date;
        this.answer=answer;

    }
}
export default chat
