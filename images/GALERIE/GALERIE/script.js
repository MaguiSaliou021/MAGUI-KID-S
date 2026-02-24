function openModal(image){
    const model=document.getElementById('modal');
    const modelImage=document.getElementById('modal-image');
    model.style.display='flex';
    modelImage.src=image.src;


}

function closeModal(){
    const model=document.getElementById('modal');
    exemple.style.display="none";

}