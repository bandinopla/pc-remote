import { KeyboardSVGIcon, MouseSVGIcon, TextSVGIcon } from "./icons";



export default function MainMenu({ tab, onClickOnTab }) {


    return <div className="grid-row">
        {[
            { Icon: <strong><MouseSVGIcon /></strong> },
            { Icon: <strong><KeyboardSVGIcon /></strong> }, 
            { Icon: <TextSVGIcon /> }
        ].map( (config,i) => (

            <div key={i} style={{   background: tab==i?"#fff":"inherit", 
                                    padding:10, 
                                    borderRadius:"0 0 30px 30px",
                                    fill: tab==i?"#000":"#fff" }} onClick={()=>onClickOnTab(i)} className="main-menu-btn">
                {config.Icon}</div>))}

    </div>
}