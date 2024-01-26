export interface Activity {
	"@context": string;
	type: string;
	id: string;
	actor: string;
	object: { type: string };
	to?: string[];
}
