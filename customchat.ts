import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getCredentialData, getCredentialParam } from '../../../src/utils'
import { CustomAPIModel } from '../../../custom/CustomAPIModel' // adjust if needed

class ChatCustomAPI implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatCustomAPI'
        this.name = 'chatCustomAPI'
        this.version = 1.0
        this.type = 'ChatCustomAPI'
        this.icon = 'chat.png'
        this.category = 'Chat Models'
        this.description = 'Use your own custom API for chat'
        this.baseClasses = ['ChatCustomAPI', 'BaseChatModel']
        this.credential = {
            label: 'Custom API Key',
            name: 'credential',
            type: 'credential',
            credentialNames: ['customAPI'],
            optional: true
        }
        this.inputs = [
            {
                label: 'Endpoint URL',
                name: 'endpoint',
                type: 'string',
                placeholder: 'https://your-api.com/chat'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                default: 0.7,
                optional: true,
                step: 0.1
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const endpoint = nodeData.inputs?.endpoint as string
        const temperature = parseFloat(nodeData.inputs?.temperature as string)
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('customAPIKey', credentialData, nodeData)

        return new CustomAPIModel({
            endpoint,
            apiKey,
            temperature
        })
    }
}

module.exports = { nodeClass: ChatCustomAPI }
