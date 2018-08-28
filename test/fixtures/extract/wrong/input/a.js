import {withRoute} from 'some/injector'

@withRoute
export class A extends React.Component {

    render() {
        return (
            <h1>Hello World!</h1>
        )
    }
}
