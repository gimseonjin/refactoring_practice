var statment = (invoice, plays) =>{

    let totalAmout = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명 : ${invoice.customer})\n`
    const format = new Intl.NumberFormat("en-US", 
                            { style : "currency", currency : "USD", 
                             minimumFractionDigits: 2}).format

    for (let perf of invoice.performances){
        const play = plays[perf.playID];
        let thisAount = 0;

        switch (play.type){
            case "tragedy":
                thisAount = 40000

                if (perf.audience > 30){
                    thisAount += 1000 * (perf.audience - 30)
                }
                break;
            
            case "comedy":
                thisAount = 30000

                if (perf.audience > 20){
                    thisAount += 10000 + 500 * (perf.audience - 20)
                }
                thisAount += 300 * perf.audience
                break;

            default :
                throw new Error(`알 수 없는 장르: ${play.type}`)
        }

        volumeCredits += Math.max(perf.audience - 30, 0)

        if("comedy" == play.type) volumeCredits += Math.floor(perf.audience / 5)

        result += ` ${play.name}: ${format(thisAount/100)} (${perf.audience}석) \n`
        totalAmout += thisAount
    }

    result += `총액 : ${format(totalAmout/100)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`
    return result


}

import fs from "fs";

const plays = fs.readFileSync('ch1/data/plays.json', 'utf8');
const invoices = fs.readFileSync('ch1/data/invoices.json', 'utf8');

const playsJson = JSON.parse(plays);
const invoicesJson = JSON.parse(invoices);

for (let invoice of invoicesJson){
    const result = statment(invoice, playsJson)
    console.log(result)
}
