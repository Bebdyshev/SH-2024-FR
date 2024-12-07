interface InputTextProps {
    title: string;
}
  
export default function InputText({ title }: InputTextProps) { 
    return (
      <section>
        <h1>{title}</h1>
        <textarea></textarea>        
      </section>
    );
}
  