export interface Activity {
	"@context": string;
	type: string;
	id: string;
	actor: string;
	object: string | Object;
	to?: string[];
}
